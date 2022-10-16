package com.greenriverdev.narrowsmith.fallproject.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;


/**
 * Trail Review subclass of Review
 * This is for a review of a mountain bike trail
 * @author Nathan Arrowsmith
 * @version 1.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrailReview extends Review
{
    private UUID reviewID; //unique id for review lookup
    private boolean isRatingValid;
    private String bikeRidden;
    private String trailConditions;
    private String weather;
    private String trailName;

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
     */
    public TrailReview(int score, String author, LocalDate dateReviewed, boolean wouldRecommend , boolean isRatingValid, String bikeRidden, String trailConditions, String weather,
                       String name )
    {
        reviewID = UUID.randomUUID();

        this.setScore(score);
        this.setAuthor(author);
        this.setDateReviewed(dateReviewed);
        this.setWouldRecommend(wouldRecommend);
        this.isRatingValid = isRatingValid;
        this.bikeRidden = bikeRidden;
        this.trailConditions = trailConditions;
        this.weather = weather;
        this.trailName = name;
    }
}
