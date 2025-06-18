package com.drive.backend.grpc.repository;

import com.drive.backend.grpc.entity.UserEntity;
import io.quarkus.hibernate.reactive.panache.PanacheRepository;
import io.smallrye.common.annotation.Blocking;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Blocking
public class UserRepository implements PanacheRepository<UserEntity> {
}