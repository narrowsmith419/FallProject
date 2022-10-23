package com.greenriverdev.narrowsmith.fallproject.services;

import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.models.TrailReview;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * service layer to accompany WebApiReview controller
 * locally stores Review objects, provides CRUD access to these Review objects
 * @author Nathan Arrowsmith
 * @version 1.0
 */
@Service
public class ReviewService
{
    private List<TrailReview> reviews = new ArrayList<>(List.of(
            new TrailReview(5,"Nathan A", LocalDate.now(),true,true,
                    "Trek Remedy", "Dry", "Evening/Sunny", "Paramount"),
            new TrailReview(2,"Bill B", LocalDate.now(),false,true,
                    "Forbidden Druid", "Wet", "Afternoon/Overcast", "Paramount"),
            new TrailReview(4,"Charles M", LocalDate.now(),true,true,
                    "Santa Cruz Nomad", "Loam", "Evening/Sunny", "Paramount"),
            new TrailReview(2,"Nathan A", LocalDate.now(),true,true,
                    "Trek Remedy", "Dry", "Afternoon/Sunny", "Paramount"),
            new TrailReview(5,"Nathan A", LocalDate.now(),true,true,
                    "Trek Remedy", "Dry", "Evening/Sunny", "Paramount"),
            new TrailReview(5,"Nathan A", LocalDate.now(),true,true,
                    "Trek Remedy", "Dry", "Evening/Sunny", "Semper Dirticus")
    ));

    /**
     * @param score score of trail 1-5
     * @param author author of review
     * @param dateReviewed date trail was ridden
     * @param wouldRecommend boolean whether author liked/disliked trail
     * @param isRatingValid boolean was the posted difficulty accurate to the author
     * @param bikeRidden type of bike ridden on trail
     * @param trailConditions dirt/air conditions on day trail ridden
     * @param weather season/whether raining/time of day
     * @param name name of the trail ridden
     * @return the created TrailReview object
     */
    //CREATE
    public TrailReview addTrailReview(int score, String author, LocalDate dateReviewed, boolean wouldRecommend,
                                      boolean isRatingValid, String bikeRidden, String trailConditions, String weather,
                                      String name)
    {
        TrailReview added = new TrailReview(score, author, dateReviewed, wouldRecommend, isRatingValid, bikeRidden,
                trailConditions, weather, name);
        reviews.add(added);
        return added;
    }

    /**
     * @return all stored Trail review objects
     */
    //READ
    public List<TrailReview> allReviews() { return reviews; }

    /**
     * @param id unique Identifier of TrailReview object
     * @param score score of trail 1-5
     * @param author author of review
     * @param dateReviewed date trail was ridden
     * @param wouldRecommend boolean whether author liked/disliked trail
     * @param isRatingValid boolean was the posted difficulty accurate to the author
     * @param bikeRidden type of bike ridden on trail
     * @param trailConditions dirt/air conditions on day trail ridden
     * @param weather season/whether raining/time of day
     * @param name name of the trail ridden
     * @return updated TrailReview object
     */
    //UPDATE
    public TrailReview updateTrailReview(UUID id, int score, String author, LocalDate dateReviewed,
                                         boolean wouldRecommend, boolean isRatingValid, String bikeRidden,
                                         String trailConditions, String weather,
                                         String name)
    {
        //optional is a wrapper to either store a null value or store a review
        Optional<TrailReview> foundTrailReview = reviews.stream()
                .filter(review -> review.getReviewID().equals(id))
                .findFirst();

        if(foundTrailReview.isPresent()) //if it's not null
        {
            //update it
            TrailReview review = foundTrailReview.get();
            review.setScore(score);
            review.setAuthor(author);
            review.setDateReviewed(dateReviewed);
            review.setWouldRecommend(wouldRecommend);
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

    /**
     * @param id of TrailReview to be deleted
     */
    //DELETE
    public void deleteReview(UUID id)
    {
        reviews = reviews.stream()
                .filter(review -> !review.getReviewID().equals(id)).toList();
    }

    /**
     * @param queryValue Trail name
     * @return matching TrailReview objects with trail name
     */
    //READ
    public List<TrailReview> searchReviewsTrailName(String queryValue)
    {
        return reviews.stream()
                .filter(review -> review.getTrailName().toLowerCase()
                        .contains(queryValue.toLowerCase()))
                .toList();
    }

    /**
     * @param queryValue Author name
     * @return matching TrailReview objects with Author name
     */
    public List<TrailReview> searchReviewsAuthorName(String queryValue)
    {
        return reviews.stream()
                .filter(review -> review.getAuthor().toLowerCase()
                        .contains(queryValue.toLowerCase()))
                .toList();
    }

    //READ
    public List<TrailReview> searchReviewsByTrailName(String trailName)
    {
        return reviews.stream()
                .filter(review -> review.getTrailName()
                        .equals(trailName))
                .toList();
    }

    /**
     * @param id unique Identifier for TrailReview object
     * @return true if TrailReview exists
     */
    public boolean reviewExists(UUID id)
    {
        return reviews.stream()
                .anyMatch(review -> review.getReviewID().equals(id));

    }

    @Override
    public String toString() {
        return "ReviewService{" +
                "reviews=" + reviews +
                '}';
    }
}
