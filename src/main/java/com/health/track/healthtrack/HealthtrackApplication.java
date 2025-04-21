package com.health.track.healthtrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.health.track.healthtrack.repository")
public class HealthtrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthtrackApplication.class, args);
	}
}
