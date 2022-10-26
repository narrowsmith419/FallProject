package com.greenriverdev.narrowsmith.fallproject.models;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * a Review Object
 * @author Nathan Arrowsmith
 * @version 1.0
 */

@Data
@NoArgsConstructor
@Builder
public class Review
{
    private final int maxScore = 5;
    private int score;
    private String author;
    private LocalDate dateReviewed;
    private boolean wouldRecommend;

    public Review(int score, String author, LocalDate dateReviewed, boolean wouldRecommend)
    {
        if(score < 0 || score > maxScore)
        {
            throw new IllegalArgumentException("Score must be 0 - 5!");
        }
        this.score = score;
        this.author = author;
        this.dateReviewed = dateReviewed;
        this.wouldRecommend = wouldRecommend;
    }

    public void setScore(int score)
    {
        if(score < 0 || score > maxScore)
        {
            throw new IllegalArgumentException("Score must be 0 - 5!");
        }
        this.score = score;
    }
}
