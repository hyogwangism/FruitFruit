package com.shop.fruitfruit.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
@Slf4j
public class FireBaseInit {

    @Value("${firebase.firebaseApiKey}")
    private String firebaseApiKey;

    @PostConstruct
    public void init() {
        try {
            FirebaseOptions options = new FirebaseOptions.Builder().setCredentials(
                    GoogleCredentials.fromStream(
                            new ClassPathResource(firebaseApiKey).getInputStream())).build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            log.error(e.getMessage());
        }
    }

}
