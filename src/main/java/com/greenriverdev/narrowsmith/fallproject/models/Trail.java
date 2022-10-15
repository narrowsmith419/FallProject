package com.greenriverdev.narrowsmith.fallproject.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

/**
 * A Trail Object Class
 * @author Nathan Arrowsmith
 * @version 1.0
 */
@Data
@AllArgsConstructor
public class Trail
{

    private UUID trailID; //unique id for trail lookup
    private int length; //length of trail
    private int elevation; //elevation of the trail
    private String state; //state where trail is located
    private String trailSystem; //trail system where trail is located
    private String name; //name of the trail
    private boolean multiDirectional; //is it a one way or two-way trail?
    private TrailDifficulty difficulty; //rating of trail


    /**
     * @param length length of trail
     * @param elevation elevation of the trail
     * @param state state where trail is located
     * @param trailSystem trail system where trail is located
     * @param name name of the trail
     * @param multiDirectional is it a one way or two-way trail?
     * @param difficulty { GREEN, BLUE, BLACK, DOUBLE_BLACK, PRO }
     */
    public Trail( int length, int elevation, String state, String trailSystem,
                 String name, boolean multiDirectional, TrailDifficulty difficulty)
    {
        trailID = UUID.randomUUID();
        this.length = length;
        this.elevation = elevation;
        this.state = state;
        this.trailSystem = trailSystem;
        this.name = name;
        this.multiDirectional = multiDirectional;
        this.difficulty = difficulty;
    }
}