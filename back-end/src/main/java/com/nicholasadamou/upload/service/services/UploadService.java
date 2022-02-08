package com.nicholasadamou.upload.service.services;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Licensed Materials - Property of IBM
 * <p>
 * (C) Copyright IBM Corp. 2022. All Rights Reserved.
 * <p>
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
@RestController
@RequestMapping("/")
public interface UploadService {
	@CrossOrigin
	@RequestMapping(method = RequestMethod.POST, consumes = { MediaType.MULTIPART_FORM_DATA }, value = "/upload")
	Response upload(@RequestBody MultipartFile file, @RequestHeader(value = "Content-Range") String contentRange, @RequestParam(value = "chunkIndex") int chunkIndex);
}
