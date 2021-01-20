import java.io.*;
import org.apache.jena.util.iterator.*;
import org.apache.jena.ontology.*;
import org.apache.jena.rdf.model.*;
import java.util.*;

public class retrieveLinks 
{
    private static File inputFolder = new File("./CORPUS");
    private static File OwlOntologyTurtleFile = new File("./JudiciaryProcessorDEMOontology.owl");
    private OntModel referenceOntology = null;
    
    private String[] allCaseLawFiles = null;
    private Hashtable<String,String> caselaw2URLs = new Hashtable<String,String>();
    private Hashtable<String,String> caselaw2handdowndates = new Hashtable<String,String>();
    private Hashtable<String,String[]> caselaw2hearingdates = new Hashtable<String,String[]>();
    private Hashtable<String,String[]> caselaw2courts = new Hashtable<String,String[]>();
    private Hashtable<String,String[]> caselaw2judges = new Hashtable<String,String[]>();
    private Hashtable<String,String[]> caselaw2parties = new Hashtable<String,String[]>();
    private Hashtable<String,String[]> caselaw2lawyers = new Hashtable<String,String[]>();
    private Hashtable<String,String[]> court2caselaw = new Hashtable<String,String[]>();
    private Hashtable<String,String[]> judge2caselaw = new Hashtable<String,String[]>();
    private Hashtable<String,String[]> party2caselaw = new Hashtable<String,String[]>();
    private Hashtable<String,String[]> lawyer2caselaw = new Hashtable<String,String[]>();
    
//CONSTRUCTOR
    public retrieveLinks()
    {
        try 
        {
                //We load the ontology
            referenceOntology = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
            FileInputStream fisOnto = new java.io.FileInputStream(OwlOntologyTurtleFile);
            referenceOntology.read(fisOnto,null,"TTL");
            String namespace = referenceOntology.getNsPrefixMap().get("");
            fisOnto.close();
            
            OntClass CaseLaw = referenceOntology.getOntClass(namespace+"CaseLaw");
            Property hasFileName = referenceOntology.getProperty(namespace+"has-filename");
            Property hasURL = referenceOntology.getProperty(namespace+"has-URL");
            Property hasHandDownDate = referenceOntology.getProperty(namespace+"has-handdown-date");
            Property hasHearingDate = referenceOntology.getProperty(namespace+"has-hearing-date");
            Property hasNames = referenceOntology.getProperty(namespace+"has-names");
            Property hasCourt = referenceOntology.getProperty(namespace+"has-court");
            Property hasJudge = referenceOntology.getProperty(namespace+"has-judge");
            Property hasParty = referenceOntology.getProperty(namespace+"has-party");
            Property hasLawyer = referenceOntology.getProperty(namespace+"has-lawyer");
            
            ExtendedIterator individuals = CaseLaw.listInstances();
            ArrayList<String> filenames = new ArrayList<String>();
            Hashtable<String,ArrayList<String>> caselaw2courtsTemp = new Hashtable<String,ArrayList<String>>();
            Hashtable<String,ArrayList<String>> caselaw2judgesTemp = new Hashtable<String,ArrayList<String>>();
            Hashtable<String,ArrayList<String>> caselaw2partiesTemp = new Hashtable<String,ArrayList<String>>();
            Hashtable<String,ArrayList<String>> caselaw2lawyersTemp = new Hashtable<String,ArrayList<String>>();
            Hashtable<String,ArrayList<String>> court2caselawTemp = new Hashtable<String,ArrayList<String>>();
            Hashtable<String,ArrayList<String>> judge2caselawTemp = new Hashtable<String,ArrayList<String>>();
            Hashtable<String,ArrayList<String>> party2caselawTemp = new Hashtable<String,ArrayList<String>>();
            Hashtable<String,ArrayList<String>> lawyer2caselawTemp = new Hashtable<String,ArrayList<String>>();
            while(individuals.hasNext())
            {
                Object o = individuals.next();
                if(!(o instanceof Individual))continue;
                Individual individual = (Individual)o;
                
                    //Filename, URL, hand-down date, and hearing dateS (plurale).
                String filename = individual.getPropertyValue(hasFileName).toString();
                filenames.add(filename);
                caselaw2URLs.put(filename, individual.getPropertyValue(hasURL).toString());
                caselaw2handdowndates.put(filename, individual.getPropertyValue(hasHandDownDate).toString());
                NodeIterator niHD = individual.listPropertyValues(hasHearingDate);
                ArrayList<String> tempHearingDates = new ArrayList<String>();
                while(niHD.hasNext())tempHearingDates.add(niHD.next().toString());
                String[] hearingDates = new String[tempHearingDates.size()];
                for(int i=0;i<tempHearingDates.size();i++)hearingDates[i]=tempHearingDates.get(i);
                caselaw2hearingdates.put(filename, hearingDates);
                    
                    //The courts needs to be ordered according with the part-of relation. This is done in the method "orderCourts".
                ArrayList<Individual> courts = orderCourts(individual.listPropertyValues(hasCourt), referenceOntology);
                for(Individual court:courts)
                {
                    String courtName = referenceOntology.getIndividual(court.toString()).getPropertyValue(hasNames).toString();
                    if(courtName.indexOf("---")!=-1)courtName=courtName.substring(0, courtName.indexOf("---")).trim();
                    addInHT(filename, courtName, caselaw2courtsTemp);
                    addInHT(courtName, filename, court2caselawTemp);
                }
                
                NodeIterator niJ = individual.listPropertyValues(hasJudge);
                while(niJ.hasNext())
                {
                    String judge = referenceOntology.getIndividual(niJ.next().toString()).getPropertyValue(hasNames).toString();
                    addInHT(filename, judge, caselaw2judgesTemp);
                    addInHT(judge, filename, judge2caselawTemp);
                }
                
                NodeIterator niP = individual.listPropertyValues(hasParty);
                while(niP.hasNext())
                {
                    String party = referenceOntology.getIndividual(niP.next().toString()).getPropertyValue(hasNames).toString();
                    addInHT(filename, party, caselaw2partiesTemp);
                    addInHT(party, filename, party2caselawTemp);
                }
                
                NodeIterator niL = individual.listPropertyValues(hasLawyer);
                while(niL.hasNext())
                {
                    String lawyer = referenceOntology.getIndividual(niL.next().toString()).getPropertyValue(hasNames).toString();
                    addInHT(filename, lawyer, caselaw2lawyersTemp);
                    addInHT(lawyer, filename, lawyer2caselawTemp);
                }
            }
            
            
                //Converting the ArrayList(s) into String[](s)
            allCaseLawFiles = new String[filenames.size()];
            for(int i=0;i<filenames.size();i++)allCaseLawFiles[i]=filenames.get(i);
            
            
            
            caselaw2courts = convertHT(caselaw2courtsTemp);
            caselaw2judges = convertHT(caselaw2judgesTemp);
            caselaw2parties = convertHT(caselaw2partiesTemp);
            caselaw2lawyers = convertHT(caselaw2lawyersTemp);
            court2caselaw = convertHT(court2caselawTemp);
            judge2caselaw = convertHT(judge2caselawTemp);
            party2caselaw = convertHT(party2caselawTemp);
            lawyer2caselaw = convertHT(lawyer2caselawTemp);
        }
        catch(Exception e)
        {
            System.out.println(e.getClass().getName()+": "+e.getMessage());
            System.exit(0);
        }
    }
    
//GET methods.
    public String[] getAllCaseLawFiles(){return allCaseLawFiles;}
    public String getURLGivenCaseLaw(String caselaw){return caselaw2URLs.get(caselaw);}
    public String getHanddownDateGivenCaseLaw(String caselaw){return caselaw2handdowndates.get(caselaw);}
    public String[] getHearingDatesGivenCaseLaw(String caselaw){return caselaw2hearingdates.get(caselaw);}
    public String[] getCourtsGivenCaseLaw(String caselaw){return caselaw2courts.get(caselaw);}
    public String[] getJudgesGivenCaseLaw(String caselaw){return caselaw2judges.get(caselaw);}
    public String[] getPartiesGivenCaseLaw(String caselaw){return caselaw2parties.get(caselaw);}
    public String[] getLawyersGivenCaseLaw(String caselaw){return caselaw2lawyers.get(caselaw);}
    public String[] getCaseLawGivenCourt(String court){return court2caselaw.get(court);}
    public String[] getCaseLawGivenJudge(String judge){return judge2caselaw.get(judge);}
    public String[] getCaseLawGivenParty(String party){return party2caselaw.get(party);}
    public String[] getCaseLawGivenLawyer(String lawyer){return lawyer2caselaw.get(lawyer);}
    
    
    
//UTILITIES
    
        //Add the newValue to the ArrayList<String> of the key unless it's already there (no duplicates).
    private static void addInHT(String key, String newValue, Hashtable<String,ArrayList<String>> ht)
    {
        ArrayList<String> values = ht.get(key);
        if(values==null){values=new ArrayList<String>();ht.put(key, values);}
        for(String s:values)
            if(s.compareToIgnoreCase(newValue)==0)
                return;
        values.add(newValue);
    }
    
        //Convert the Hashtable<String,ArrayList<String>> into an Hashtable<String,String[]>
    private static Hashtable<String,String[]> convertHT(Hashtable<String,ArrayList<String>> ht)
    {
        Hashtable<String,String[]> ret = new Hashtable<String,String[]>();
        Enumeration<String> en = ht.keys();
        while(en.hasMoreElements())
        {
            String key = en.nextElement();
            ArrayList<String> values = ht.get(key);
            String[] temp = new String[values.size()];
            for(int i=0;i<values.size();i++)temp[i]=values.get(i);
            ret.put(key, temp);
        }
        return ret;
    }
    
        //order the courts according with the part-of relation.
    private static ArrayList<Individual> orderCourts(NodeIterator niC, OntModel referenceOntology)
    {
        String namespace = referenceOntology.getNsPrefixMap().get("");
        Property partOf = referenceOntology.getProperty(namespace+"part-of");
            
        ArrayList<Individual> courts = new ArrayList<Individual>();
        while(niC.hasNext())courts.add(referenceOntology.getIndividual(niC.next().toString()));
        
            //We order the courts on the part-of relation, whenever we can. 
            //We look if there is at least one court to move after another one because the former is part-of the latter.
            //We reiterate until we keep finding pairs as such.
        Individual toMove = null;
        Individual afterThis = null;
        do
        {
            toMove = null;
            afterThis = null;
            for(int i=0;(i<courts.size()-1&&(toMove==null)&&(afterThis==null));i++)
            {
                for(int j=i+1;j<courts.size();j++)
                {
                    //if(courts.get(j).getPropertyValue(partOf)!=null)
                    //System.out.println(courts.get(j).getPropertyValue(partOf).toString());
                    if
                    (
                        (courts.get(i).getPropertyValue(partOf)!=null)&&
                        (courts.get(i).getPropertyValue(partOf).toString().compareToIgnoreCase(courts.get(j).toString())==0)
                    ){toMove=courts.get(i);afterThis=courts.get(j);break;}
                }
            }
            if((toMove!=null)&&(afterThis!=null))
            {
                courts.remove(toMove);
                courts.add(courts.indexOf(afterThis)+1, toMove);
            }
        }
        while((toMove!=null)&&(afterThis!=null));
        
        return courts;
    }
    
//main method to test the relations extracted from the ontology.
    public static void main(String[] args)
    {
        try 
        {
            retrieveLinks retrieveLinks = new retrieveLinks();
            
            String[] allCaseLawFiles = retrieveLinks.getAllCaseLawFiles();
            for(int i=0;i<allCaseLawFiles.length;i++)System.out.println(allCaseLawFiles[i]);
            
            for(int i=0;i<allCaseLawFiles.length;i++)
            {
                System.out.println(allCaseLawFiles[i]+":");
                
                String[] temp = retrieveLinks.getCourtsGivenCaseLaw(allCaseLawFiles[i]);
                for(int j=0;j<temp.length;j++)
                {
                    System.out.println("\tCourt: \""+temp[j]+"\"");
                    String[] temp2 = retrieveLinks.getCaseLawGivenCourt(temp[j]);
                    for(int k=0;k<temp2.length;k++)
                    {
                        System.out.println("\t\tCase Law: "+temp2[k]);
                    }
                }
                
                temp = retrieveLinks.getJudgesGivenCaseLaw(allCaseLawFiles[i]);
                for(int j=0;j<temp.length;j++)
                {
                    System.out.println("\tJudge: \""+temp[j]+"\"");
                    String[] temp2 = retrieveLinks.getCaseLawGivenJudge(temp[j]);
                    for(int k=0;k<temp2.length;k++)
                    {
                        System.out.println("\t\tCase Law: "+temp2[k]);
                    }
                }
                
                temp = retrieveLinks.getPartiesGivenCaseLaw(allCaseLawFiles[i]);
                for(int j=0;j<temp.length;j++)
                {
                    System.out.println("\tParty: \""+temp[j]+"\"");
                    String[] temp2 = retrieveLinks.getCaseLawGivenParty(temp[j]);
                    for(int k=0;k<temp2.length;k++)
                    {
                        System.out.println("\t\tCase Law: "+temp2[k]);
                    }
                }
                
                temp = retrieveLinks.getLawyersGivenCaseLaw(allCaseLawFiles[i]);
                for(int j=0;j<temp.length;j++)
                {
                    System.out.println("\tLawyer: \""+temp[j]+"\"");
                    String[] temp2 = retrieveLinks.getCaseLawGivenLawyer(temp[j]);
                    for(int k=0;k<temp2.length;k++)
                    {
                        System.out.println("\t\tCase Law: "+temp2[k]);
                    }
                }
            }
        }
        catch(Exception e)
        {
            System.out.println(e.getClass().getName()+": "+e.getMessage());
        }
    }
}