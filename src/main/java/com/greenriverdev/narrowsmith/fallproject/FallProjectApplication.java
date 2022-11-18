package com.greenriverdev.narrowsmith.fallproject;

import com.greenriverdev.narrowsmith.fallproject.models.TrailDifficulty;
import com.greenriverdev.narrowsmith.fallproject.models.TrailSystem;
import com.greenriverdev.narrowsmith.fallproject.services.ReviewService;
import com.greenriverdev.narrowsmith.fallproject.services.TrailService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDate;

@SpringBootApplication
public class FallProjectApplication {

    public static void main(String[] args)
    {

        SpringApplication.run(FallProjectApplication.class, args);

        TrailService trailService = new TrailService();
        ReviewService reviewService = new ReviewService();

        System.out.println(trailService.allTrails());
        System.out.println();
        System.out.println(reviewService.allReviews());
        trailService.addTrail(2, 700, "OR",
                new TrailSystem(45.379585, -122.030078, "Sandy Ridge"), "Jonny Royale",
                "../images/paramountTrail.jpeg", false, TrailDifficulty.DOUBLE_BLACK);
        reviewService.addTrailReview(5, "Nathan", LocalDate.now(),true, true,
                "Trek Remedy", "loamy", "Wet/Morning", "Jonny Royale");


    }

}
