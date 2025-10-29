package com.drive.backend.grpc.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "users")
public class UserEntity {
  @Id
  @SequenceGenerator(name = "users_id_seq", allocationSize = 1)
  @GeneratedValue(generator = "users_id_seq")
  private Long id;

  private String name;
  private String email;
}
