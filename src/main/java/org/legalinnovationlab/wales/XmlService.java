package org.legalinnovationlab.wales;

import io.helidon.common.http.Http;
import io.helidon.webserver.*;

import java.io.*;
import java.net.URL;

public class XmlService implements Service {

    @Override
    public void update(Routing.Rules rules) {
        rules.get("/case/{value}", this::getCaseLawFile);
        rules.get("/{+}", this::notFound);
    }

    private void getCaseLawFile(ServerRequest request, ServerResponse response) {
        String value = request.path().absolute().param("value");
        String fileName = value + ".xml";
        URL fileUrl = getClass().getClassLoader().getResource("CORPUS/" + fileName);

        if (fileUrl != null) {
            try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("CORPUS/" + fileName)) {
                response.status(Http.Status.OK_200);
                response.headers().add("Content-Type", "text/xml");
                response.send(inputStream.readAllBytes());
            } catch (IOException e) {
                e.printStackTrace();
                response.status(Http.Status.INTERNAL_SERVER_ERROR_500).send();
            }
        } else {
            notFound(request, response);
        }
    }

    private void notFound(ServerRequest request, ServerResponse response) {
        response.status(Http.Status.NOT_FOUND_404).send();
    }
}
