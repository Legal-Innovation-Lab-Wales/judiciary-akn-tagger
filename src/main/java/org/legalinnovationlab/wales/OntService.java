package org.legalinnovationlab.wales;

import io.helidon.common.http.*;
import io.helidon.webserver.*;
import org.apache.jena.ontology.*;
import org.apache.jena.rdf.model.*;

import java.io.*;
import java.util.*;
import java.util.stream.*;

public class OntService implements Service {

    private static final String URL = "url";
    private static final String HAND_DOWN_DATE = "hand_down_date";
    private static final String HEARING_DATE = "hearing_date";

    protected static final String FILE = "file";
    protected static final String COURTS = "courts";
    protected static final String JUDGES = "judges";
    protected static final String LAWYERS = "lawyers";
    protected static final String PARTIES = "parties";

    private static final List<Map<String, Object>> CASE_LAW_FILES = new ArrayList<>();

    private OntModel ontModel;
    private String namespace;

    public OntService() {
        // Load Ontology Model
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("JudiciaryProcessorDEMOontology.owl")) {
            ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
            ontModel.read(inputStream, null, "TTL");
            namespace = ontModel.getNsPrefixMap().get("");

            // Add every Individual from the models CaseLaw class to CASE_LAW_FILES
            ontModel.getOntClass(namespace + "CaseLaw").listInstances()
                    .forEachRemaining(individual -> addCase((Individual) individual));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Every CaseLaw Individual is represented via a LinkedHashMap
    private void addCase(Individual individual) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put(FILE, getPropertyValue(individual, "has-filename").replaceAll(".xml", ""));
        map.put(URL, getPropertyValue(individual, "has-URL"));
        map.put(HAND_DOWN_DATE, getPropertyValue(individual, "has-handdown-date"));
        map.put(HEARING_DATE, getPropertyValue(individual, "has-hearing-date"));

        List<String> courtList = new ArrayList<>();
        orderCourts(individual.listPropertyValues(getProperty("has-court"))).forEach(court -> addCourt(courtList, court));
        map.put(COURTS, courtList);
        map.put(JUDGES, getMultiple(individual.listPropertyValues(getProperty("has-judge"))));
        map.put(LAWYERS, getMultiple(individual.listPropertyValues(getProperty("has-lawyer"))));
        map.put(PARTIES, getMultiple(individual.listPropertyValues(getProperty("has-party"))));

        CASE_LAW_FILES.add(map);
    }

    // The courts are ordered according to the below algorithm
    private List<Individual> orderCourts(NodeIterator nodeIterator) {
        List<Individual> courts = new ArrayList<>();
        nodeIterator.forEachRemaining(node -> courts.add(getIndividual(node)));

        // TODO: Fairly certain this can be replaced with a custom Collections.sort implementation...
        Individual toMove, afterThis;
        do {
            toMove = null;
            afterThis = null;

            for (int i = 0; (i < courts.size() - 1 && (toMove == null) && (afterThis == null)); i++) {
                for (int j = i + 1; j < courts.size(); j++) {
                    Individual individualA = courts.get(i);
                    Individual individualB = courts.get(j);

                    if (individualA.hasProperty(getProperty("part-of")) &&
                            getPropertyValue(individualA, "part-of").equalsIgnoreCase(individualB.toString())) {
                        toMove = courts.get(i);
                        afterThis = courts.get(j);
                        break;
                    }
                }
            }

            if(toMove != null && afterThis != null) {
                courts.remove(toMove);
                courts.add(courts.indexOf(afterThis) + 1, toMove);
            }
        } while (toMove != null && afterThis != null);

        return courts;
    }

    // Cleanup the court name where applicable
    private void addCourt(List<String> list, Individual court) {
        String courtName = getPropertyValue(getIndividual(court.toString()), "has-names");
        courtName = courtName.contains("---") ? courtName.substring(0, courtName.indexOf("---")).trim() : courtName;
        list.add(courtName);
    }

    // Multiples represent Properties on the CaseLaw class with a one-to-many relationship such as Judges & Lawyers
    private List<String> getMultiple(NodeIterator nodeIterator) {
        List<String> list = new ArrayList<>();
        nodeIterator.forEachRemaining(node -> list.add(getPropertyValue(getIndividual(node), "has-names")));
        return list;
    }

    // Below are utility functions that capture lengthy repeated operations
    private String getPropertyValue(Individual individual, String str) {
        Property property = getProperty(str);
        return individual.hasProperty(property) ? individual.getPropertyValue(property).toString() : "";
    }

    private Property getProperty(String str) { return ontModel.getProperty(namespace + str); }

    private Individual getIndividual(RDFNode node) { return getIndividual(node.toString()); }

    private Individual getIndividual(String str) { return ontModel.getIndividual(str); }

    @Override
    public void update(Routing.Rules rules) {
        rules.get("/case/{value}", this::getCaseMetaData);
        rules.get("/cases", this::getAllCases);
        rules.get("/cases/{param}/{value}", this::getCasesByParam);
        rules.get("/{+}", this::notFound);
    }

    private void getCaseMetaData(ServerRequest request, ServerResponse response) {
        String fileName = request.path().absolute().param("value") + ".xml";

        Map<String, Object> caseLawFile = CASE_LAW_FILES.stream()
                .filter(map -> fileName.equalsIgnoreCase((String) map.get(FILE)))
                .findFirst()
                .orElse(null);

        if (caseLawFile != null) {
            sendOKJsonResponse(response, caseLawFile);
        } else {
            notFound(request, response);
        }
    }

    private void getAllCases(ServerRequest request, ServerResponse response) {
        sendOKJsonResponse(response, CASE_LAW_FILES);
    }

    private void getCasesByParam(ServerRequest request, ServerResponse response) {
        HttpRequest.Path path = request.path().absolute();

        List<String> cases = CASE_LAW_FILES.stream()
                .filter(map -> ((List<String>) map.get(path.param("param"))).contains(path.param("value")))
                .map(map -> (String) map.get(FILE))
                .collect(Collectors.toList());

        sendOKJsonResponse(response, cases);
    }

    private void sendOKJsonResponse(ServerResponse response, Object responseEntity) {
        response.status(Http.Status.OK_200);
        response.headers().add(Http.Header.CONTENT_TYPE, "application/json");
        response.send(responseEntity);
    }

    private void notFound(ServerRequest request, ServerResponse response) {
        response.status(Http.Status.NOT_FOUND_404).send();
    }
}