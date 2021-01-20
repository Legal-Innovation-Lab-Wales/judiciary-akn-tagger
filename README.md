# judiciaryAknTagger
This repository contains source code and data for tagging a repository of 100 case law from https://www.judiciary.uk in the Akoma Ntoso XML standard (http://www.akomantoso.org).

TO COMPILE: javac -cp jena-core-3.9.0.jar retrieveLinks.java

TO RUN: java -cp ./lib/*;. retrieveLinks

The class retrieveLinks.java includes methods to extract information from the knowledge graph in JudiciaryProcessorDEMOontology.owl. It also includes a main method that simply prints all information of all XML files in CORPUS.

<b>GET methods in retrieveLinks.java:</b>

  public String[] getAllCaseLawFiles()
  
    => it lists all case law mapped in the ontology (filenames). 
    Each of them corresponds to a file in the CORPUS subfolder.
  
  
  public String getURLGivenCaseLaw(String caselaw)
  
  public String getHanddownDateGivenCaseLaw(String caselaw)
  
  public String[] getHearingDatesGivenCaseLaw(String caselaw)
  
    => Given a case law (returned from getAllCaseLawFiles), these methods return 
    the URL of the file on the Web, the hand-down date, and the hearing dates.
  
  
  public String[] getCourtsGivenCaseLaw(String caselaw){return caselaw2courts.get(caselaw);}
  
    => Given a case law (returned from getAllCaseLawFiles), this method returns 
    the list of courts ordered from the more generic to the more specific, e.g.:
          - HIGH COURT OF JUSTICE
            - QUEEN'S BENCH DIVISION
              - ADMINISTRATIVE COURT
    
  public String[] getJudgesGivenCaseLaw(String caselaw){return caselaw2judges.get(caselaw);}
  
  public String[] getPartiesGivenCaseLaw(String caselaw){return caselaw2parties.get(caselaw);}
  
  public String[] getLawyersGivenCaseLaw(String caselaw){return caselaw2lawyers.get(caselaw);}
  
    => Given a case law (returned from getAllCaseLawFiles), these methods return 
    the list of judges, parties, and lawyers occurring therein.
    => NOTE: Lawyers and Judges are not disjoint! Some judges also act as lawyers 
    (in different case law, of course :-))
  
  public String[] getCaseLawGivenCourt(String court){return court2caselaw.get(court);}
  
  public String[] getCaseLawGivenJudge(String judge){return judge2caselaw.get(judge);}
  
  public String[] getCaseLawGivenParty(String party){return party2caselaw.get(party);}
  
  public String[] getCaseLawGivenLawyer(String lawyer){return lawyer2caselaw.get(lawyer);}
  
    => Given a court, judge, party, or lawyer, these methods return 
    the list of case law in which they occur.
