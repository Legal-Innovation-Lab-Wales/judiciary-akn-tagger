import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        OntResource ontResource = new OntResource();

        List<Map<String, Object>> allCases = ontResource.getAllCases();

        allCases.forEach(caseLawFile -> System.out.println(caseLawFile.get(OntResource.FILE)));

        allCases.forEach(caseLawFile -> {
            System.out.println(caseLawFile.get(OntResource.FILE) + ":");
            print(ontResource, caseLawFile, OntResource.COURTS, "Court");
            print(ontResource, caseLawFile, OntResource.JUDGES, "Judge");
            print(ontResource, caseLawFile, OntResource.PARTIES, "Party");
            print(ontResource, caseLawFile, OntResource.LAWYERS, "Lawyer");
        });
    }

    private static void print(OntResource ontResource, Map<String, Object> caseLawFile, String param, String type) {
        ((List<String>) caseLawFile.get(param)).forEach(value -> {
            System.out.println("\t" + type + ": \"" + value + "\"");
            ontResource.getCasesByParam(param, value).forEach(caseLaw -> System.out.println("\t\tCase Law: " + caseLaw));
        });
    }
}
