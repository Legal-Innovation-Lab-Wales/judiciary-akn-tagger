package org.legalinnovationlab.wales;

import io.helidon.common.http.Http;
import io.helidon.common.http.HttpRequest;
import io.helidon.webserver.Routing;
import io.helidon.webserver.ServerRequest;
import io.helidon.webserver.ServerResponse;
import io.helidon.webserver.Service;
import org.apache.jena.ontology.Individual;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class OntService implements Service {

    private static final String FILE = "file";

    private List<Map<String, Object>> caseLawFiles;
    private OntModel ontModel;
    private String namespace;

    public OntService() {
        caseLawFiles = new ArrayList<>();

        // Load Ontology Model
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("JudiciaryProcessorDEMOontology.owl")) {
            ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
            ontModel.read(inputStream, null, "TTL");
            namespace = ontModel.getNsPrefixMap().get("");

            // Add every Individual from the models CaseLaw class to caseLawFiles
            ontModel.getOntClass(namespace + "CaseLaw").listInstances()
                    .forEachRemaining(individual -> addCase((Individual) individual));

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

            caseLawFiles = caseLawFiles.stream()
                    .sorted((map1, map2) -> {
                        try {
                            Date date1 = dateFormat.parse((String) map1.get("hand_down_date"));
                            Date date2 = dateFormat.parse((String) map2.get("hand_down_date"));

                            return date2.compareTo(date1);
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }

                        return 0;
                    })
                    .collect(Collectors.toList());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Every CaseLaw Individual is represented via a LinkedHashMap
    private void addCase(Individual individual) {
        Map<String, Object> map = new HashMap<>();
        map.put(FILE, getPropertyValue(individual, "has-filename").replaceAll(".xml", ""));
        map.put("url", getPropertyValue(individual, "has-URL"));
        map.put("hand_down_date", getPropertyValue(individual, "has-handdown-date"));
        map.put("hearing_date", getPropertyValue(individual, "has-hearing-date"));

        List<String> courtList = new ArrayList<>();
        orderCourts(individual.listPropertyValues(getProperty("has-court"))).forEach(court -> addCourt(courtList, court));
        map.put("courts", courtList);
        map.put("judges", getMultiple(individual.listPropertyValues(getProperty("has-judge"))));
        map.put("lawyers", getMultiple(individual.listPropertyValues(getProperty("has-lawyer"))));

        caseLawFiles.add(map);
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
        rules.get("/case/{case}", this::getCaseMetaData);
        rules.get("/cases", this::getAllCases);
        rules.get("/{entity}/{case}", this::getCasesForEntity);
        rules.get("/{+}", this::notFound);
    }

    private void getCaseMetaData(ServerRequest request, ServerResponse response) {
        Map<String, Object> caseLawFile = getCase(request.path().absolute().param("case"));

        if (caseLawFile != null) {
            sendOKJsonResponse(response, caseLawFile);
        } else {
            notFound(request, response);
        }
    }

    private void getAllCases(ServerRequest request, ServerResponse response) {
        sendOKJsonResponse(response, caseLawFiles.stream());
    }

    private void getCasesForEntity(ServerRequest request, ServerResponse response) {
        HttpRequest.Path path = request.path().absolute();
        String entityType = path.param("entity");
        String caseId = path.param("case");

        List<Map<String, Object>> allCases = new ArrayList<>();
        Map<String, Object> caseLawFile = getCase(caseId);

        if (caseLawFile != null) {
            List<String> allEntities = (ArrayList<String>) caseLawFile.get(entityType);

            allEntities.forEach(entity -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", entity);
                map.put("cases", getCaseByEntity(entityType, entity));
                allCases.add(map);
            });

            sendOKJsonResponse(response, allCases);
        } else {
            response.status(Http.Status.NOT_FOUND_404).send();
        }
    }

    private Map<String, Object> getCase(String caseId) {
        return caseLawFiles.stream()
                .filter(map -> caseId.equalsIgnoreCase((String) map.get(FILE)))
                .findFirst()
                .orElse(null);
    }

    private List<String> getCaseByEntity(String entity, String value) {
        return caseLawFiles.stream()
                .filter(map -> ((List<String>) map.get(entity)).contains(value))
                .map(map -> (String) map.get(FILE))
                .collect(Collectors.toList());
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