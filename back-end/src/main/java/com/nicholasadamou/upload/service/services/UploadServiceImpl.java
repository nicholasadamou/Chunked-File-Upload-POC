package com.nicholasadamou.upload.service.services;

import com.nicholasadamou.upload.service.controller.UploadController;
import com.nicholasadamou.upload.service.util.ServiceResponseConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.ws.rs.core.Response;

/**
 * Licensed Materials - Property of IBM
 * <p>
 * (C) Copyright IBM Corp. 2022. All Rights Reserved.
 * <p>
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
@Component
public class UploadServiceImpl implements UploadService {
	Logger logger = LoggerFactory.getLogger(UploadServiceImpl.class);

	@Autowired
	private UploadController uploadController;

	@Override
	public Response upload(MultipartFile file, String contentRange, int chunkIndex) {
		int status = uploadController.buildFile(file, contentRange, chunkIndex);

		if (status == 200) {
			return Response.status(Response.Status.OK).build();
		} else if (status == 500) {
			return ServiceResponseConstants.DEFAULT_ERROR_RESPONSE;
		}

		return Response.status(Response.Status.PARTIAL_CONTENT).build();
	}
}
