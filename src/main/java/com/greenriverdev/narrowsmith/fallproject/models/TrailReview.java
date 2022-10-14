package com.greenriverdev.narrowsmith.fallproject.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


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
    private boolean isRatingValid;
    private String bikeRidden;
    private String trailConditions;
    private String weather;

}
