package com.greenriverdev.narrowsmith.fallproject.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A TrailSystem Class that holds the TrailSystem name and the GPS coordinates
 * this Class was created to integrate trailSystems into the leaflet Map on homepage
 * @author Nathan Arrowsmith
 * @version 1.0
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrailSystem
{
    private double lat;
    private double lon;
    private String name;

}
