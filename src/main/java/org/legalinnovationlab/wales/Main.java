
package org.legalinnovationlab.wales;

import io.helidon.common.LogConfig;
import io.helidon.config.Config;
import io.helidon.media.jackson.JacksonSupport;
import io.helidon.webserver.Routing;
import io.helidon.webserver.StaticContentSupport;
import io.helidon.webserver.WebServer;
import io.helidon.webserver.jersey.JerseySupport;

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
        return Routing.builder()
                .register("/api", JerseySupport.builder()
                        .register(OntResource.class)
                        .build())
                .register("/", StaticContentSupport.builder("/static-content")
                        .welcomeFileName("index.html")
                        .build())
                .build();
    }
}
