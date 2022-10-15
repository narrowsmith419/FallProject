package com.greenriverdev.narrowsmith.fallproject.controllers;

import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.models.TrailReview;
import com.greenriverdev.narrowsmith.fallproject.services.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/review")
public class WebApiReview
{
    private ReviewService service;

    public WebApiReview(ReviewService service)
    {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<List<TrailReview>> allReviews()
    {
        return new ResponseEntity<>(service.allReviews(), HttpStatus.OK);
    }
}
