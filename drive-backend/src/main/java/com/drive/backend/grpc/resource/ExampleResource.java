package com.drive.backend.grpc.resource;

import com.drive.backend.grpc.dto.HelloResponse;
import io.quarkus.example.Greeter;
import io.quarkus.example.HelloRequest;
import io.quarkus.grpc.GrpcClient;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;


@Path("/hello")
@Produces(MediaType.APPLICATION_JSON)
public class ExampleResource {
    @GrpcClient
    Greeter hello;

    @GET
    public HelloResponse hello() {
        return new HelloResponse("hello");
    }

    @GET
    @Path("/{name}")
    public Uni<HelloResponse> hello(@PathParam("name") String name) {
        return hello.sayHello(HelloRequest.newBuilder().setName(name).build())
                .onItem().transform(reply -> new HelloResponse(reply.getMessage()));
    }
}
