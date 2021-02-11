
package org.legalinnovationlab.wales;

import io.helidon.common.LogConfig;
import io.helidon.config.Config;
import io.helidon.media.jackson.JacksonSupport;
import io.helidon.webserver.*;

public final class Main {

    private Main() {}

    public static void main(final String[] args) {
        startServer();
    }

    static WebServer startServer() {
        LogConfig.configureRuntime();

        Config config = Config.create();

        JacksonSupport jacksonSupport = JacksonSupport.create();

        WebServer server = WebServer.builder(createRouting())
                .config(config.get("server"))
                .addMediaSupport(jacksonSupport)
                .build();

        server.start()
                .thenAccept(ws -> {
                    System.out.println("WEB server is up! http://localhost:" + ws.port());
                    ws.whenShutdown().thenRun(() -> System.out.println("WEB server is DOWN. Good bye!"));
                })
                .exceptionally(t -> {
                    System.err.println("Startup failed: " + t.getMessage());
                    t.printStackTrace(System.err);
                    return null;
                });

        return server;
    }

    private static Routing createRouting() {
        StaticContentSupport staticContent = StaticContentSupport.builder("/static-content")
            .welcomeFileName("index.html")
            .build();

        return Routing.builder()
                .register("/api", new OntService())
                .register("/xml", new XmlService())
                // Below I'm handing off to the React framework to handle route management
                .register("/", staticContent)
                .register("/{+}", staticContent)
                .build();
    }
}
