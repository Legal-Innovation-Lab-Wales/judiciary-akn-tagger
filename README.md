# judiciaryAknTagger
This repository contains source code and data about a repository of 100 case law from https://www.judiciary.uk tagged in the Akoma Ntoso XML standard (http://www.akomantoso.org). The Akoma Ntoso files are included in a subfolder CORPUS. The OWL file JudiciaryProcessorDEMOontology.owl contains the knowledge graph indexing the corpus. The Java file retrieveLinks.java allows to retrieve the information from the ontology via the methods described below.

```
Java Version: 11

Window
javac -cp jena-core-3.9.0.jar retrieveLinks.java
java -cp ./lib/*;. retrieveLinks

Mac-OS
javac -cp ./lib/jena-core-3.9.0.jar retrieveLinks.java
java -cp "./lib/*:." retrieveLinks
```

The class retrieveLinks.java includes methods to extract information from the knowledge graph in JudiciaryProcessorDEMOontology.owl. It also includes a main method that simply prints all information of all XML files in CORPUS.

<b>GET methods in retrieveLinks.java:</b>

  public String[] getAllCaseLawFiles()
  
    => OUTPUT: the list of case law mapped in the ontology (filenames). Each of them corresponds to a file in the CORPUS subfolder.
  
  
  public String getURLGivenCaseLaw(String caselaw)<br>
  public String getHanddownDateGivenCaseLaw(String caselaw)<br>
  public String[] getHearingDatesGivenCaseLaw(String caselaw)
  
    => INPUT: a case law (returned from getAllCaseLawFiles)
       OUTPUT: the URL of the file on the Web, the hand-down date, and the hearing dates.
  
  
  public String[] getCourtsGivenCaseLaw(String caselaw)
  
    => INPUT: a case law (returned from getAllCaseLawFiles)
       OUTPUT: the list of courts ordered from the more generic to the more specific, e.g.:
          - HIGH COURT OF JUSTICE
            - QUEEN'S BENCH DIVISION
              - ADMINISTRATIVE COURT
    
  public String[] getJudgesGivenCaseLaw(String caselaw)<br>
  public String[] getPartiesGivenCaseLaw(String caselaw)<br>
  public String[] getLawyersGivenCaseLaw(String caselaw)
  
    => INPUT: a case law (returned from getAllCaseLawFiles)
       OUTPUT: the list of judges, parties, and lawyers occurring therein.
    
    NOTE: Lawyers and Judges are not disjoint sets! Some judges also act as lawyers (in different case law, of course :-))
  
  public String[] getCaseLawGivenCourt(String court)<br>
  public String[] getCaseLawGivenJudge(String judge)<br>
  public String[] getCaseLawGivenParty(String party)<br>
  public String[] getCaseLawGivenLawyer(String lawyer)
  
    => INPUT: a case law (returned from getAllCaseLawFiles)
       OUTPUT: the list of case law in which they occur.
