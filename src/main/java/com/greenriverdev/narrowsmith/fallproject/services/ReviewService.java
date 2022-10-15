package com.greenriverdev.narrowsmith.fallproject.services;

import com.greenriverdev.narrowsmith.fallproject.models.TrailReview;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReviewService
{
    private List<TrailReview> reviews = new ArrayList<>(List.of(
            new TrailReview(true, "Trek Remedy", "Dry", "Evening/Sunny", "Paramount"),
            new TrailReview(true, "Trek Remedy", "Dry", "Evening/Sunny", "Semper Dirticus")
    ));

    //CREATE
    public TrailReview addTrailReview(boolean isRatingValid, String bikeRidden, String trailConditions, String weather,
                                      String name)
    {
        TrailReview added = new TrailReview(isRatingValid, bikeRidden, trailConditions, weather,
                name);
        reviews.add(added);
        return added;
    }

    //READ
    public List<TrailReview> allReviews() { return reviews; }

    //UPDATE
    public TrailReview updateTrailReview(UUID id, boolean isRatingValid, String bikeRidden, String trailConditions, String weather,
                                         String name)
    {
        //optional is a wrapper to either store a null value or store a joke
        Optional<TrailReview> foundTrailReview = reviews.stream()
                .filter(review -> review.getReviewID().equals(id))
                .findFirst();

        if(foundTrailReview.isPresent()) //if it's not null
        {
            //update it
            TrailReview review = foundTrailReview.get();
            review.setRatingValid(isRatingValid);
            review.setBikeRidden(bikeRidden);
            review.setTrailConditions(trailConditions);
            review.setWeather(weather);
            review.setTrailName(name);
            return review;
        }
        else
        {
            return null;
        }
    }

    //DELETE
    public void deleteReview(UUID id)
    {
        reviews = reviews.stream()
                .filter(review -> !review.getReviewID().equals(id)).toList();
    }

    //READ
    public List<TrailReview> searchReviews(String queryValue)
    {
        return reviews.stream()
                .filter(review -> review.getTrailName().toLowerCase()
                        .contains(queryValue.toLowerCase()))
                .toList();
    }

    public boolean reviewExists(UUID id)
    {
        return reviews.stream()
                .anyMatch(review -> review.getReviewID().equals(id));

    }

}
