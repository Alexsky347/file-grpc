package com.drive.backend.grpc.service;

import io.quarkus.example.Greeter;
import io.quarkus.example.HelloReply;
import io.quarkus.example.HelloRequest;
import io.quarkus.grpc.GrpcService;
import io.smallrye.mutiny.Uni;

@GrpcService
public class GreeterService implements Greeter {
    @Override
    public Uni<HelloReply> sayHello(HelloRequest request) {
        return Uni.createFrom().item(
                HelloReply.newBuilder().setMessage("Hello " + request.getName()).build()
        );
    }
}