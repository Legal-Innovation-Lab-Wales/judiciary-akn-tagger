package org.legalinnovationlab.wales;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;

@Path("/")
@Consumes(MediaType.TEXT_XML)
@Produces(MediaType.TEXT_XML)
public class XmlResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(XmlResource.class);
    private static final String CASE_LAW_FILE_ERROR = "Case law file [{}] could not be loaded!";
    private static final String CASE_LAW_FILE_NOT_FOUND = "Case law file [{}] not found!";

    @Path("/case/{value}")
    @GET
    public Response getCaseLawFile(@PathParam("value") String value) {
        String fileName = value + ".xml";
        URL fileUrl = getClass().getClassLoader().getResource("CORPUS/" + fileName);

        if (fileUrl != null) {
            try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("CORPUS/" + fileName)) {
                return Response.ok().entity(inputStream.readAllBytes()).build();
            } catch (IOException e) {
                LOGGER.error(CASE_LAW_FILE_ERROR, value, e);
                return Response.serverError().build();
            }
        } else {
            return Response.status(BAD_REQUEST).entity(CASE_LAW_FILE_NOT_FOUND).build();
        }
    }
}
