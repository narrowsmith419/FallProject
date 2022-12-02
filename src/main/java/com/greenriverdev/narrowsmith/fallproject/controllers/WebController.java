package com.greenriverdev.narrowsmith.fallproject.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

/**
 * A Controller class that will define routes to future pages
 * We will also connect with Services here
 * @author Nathan Arrowsmith
 * @version 1.0
 */

@Controller
public class WebController
{

    public WebController() {}

    //the methods below will define a route to a page

    //http://localhost:8080/home
    @GetMapping("home")
    public String getHomepage()
    {
        //the name of the view (in the templates directory)
        return "home_page";
    }
}