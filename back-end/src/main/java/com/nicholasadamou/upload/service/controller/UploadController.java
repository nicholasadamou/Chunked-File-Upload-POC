package com.nicholasadamou.upload.service.controller;

import com.nicholasadamou.upload.service.model.FilePayload;
import com.nicholasadamou.upload.service.model.SupportingDocument;
import com.nicholasadamou.upload.service.util.CompressionUtils;
import com.nicholasadamou.upload.service.util.Utilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

/**
 * Licensed Materials - Property of IBM
 * <p>
 * (C) Copyright IBM Corp. 2022. All Rights Reserved.
 * <p>
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
@CrossOrigin
@Component
public class UploadController {
	Logger logger = LoggerFactory.getLogger(UploadController.class);

	@Autowired
	private CompressionUtils compressionUtils;

	@Autowired
	private Utilities utilities;

	public int buildFile(MultipartFile file, String contentRange, int chunkIndex) {
		final String TMP_FILE_PATH = "/tmp/";

		String fileName = file.getOriginalFilename();
		String base64 = utilities.getFileNameWithoutExtension(fileName);
		SupportingDocument supportingDocument = SupportingDocument.constructFromBase64(base64);
		String filePath = TMP_FILE_PATH + supportingDocument.getFileName();

		boolean isFileUploaded = utilities.isFileUploadCompleted(contentRange);

		logger.info(String.format("Received %s", supportingDocument));
		logger.info(String.format("chunkIndex: %d, isFileUploaded: %s", chunkIndex, isFileUploaded));

		if (chunkIndex == 0) {
			boolean didCreateFile = false;

			try {
				didCreateFile = new File(filePath).createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
			}

			if (didCreateFile) {
				utilities.appendDataToFile(file, filePath);

				logger.info(String.format("File %s created and chunk index %d appended.", supportingDocument.getFileName(), chunkIndex));
			} else {
				logger.info(String.format("Creating file failed due to file %s already exists.", supportingDocument.getFileName()));
				logger.info(String.format("Attempting to delete file %s.", supportingDocument.getFileName()));

				File document = new File(filePath);

				if (document.delete()) {
					logger.info(String.format("File %s deleted.", supportingDocument.getFileName()));
					logger.info(String.format("Creating file %s at %s.", supportingDocument.getFileName(), filePath));

					try {
						didCreateFile = new File(filePath).createNewFile();
					} catch (IOException e) {
						e.printStackTrace();
					}

					if (didCreateFile) {
						utilities.appendDataToFile(file, filePath);

						logger.info(String.format("File %s created and chunk index %d appended.", supportingDocument.getFileName(), chunkIndex));
					} else {
						return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
					}
				}
			}
		} else {
			utilities.appendDataToFile(file, filePath);

			logger.info(String.format("Appended chunk index %d to File %s.", chunkIndex, filePath));
		}

		if (isFileUploaded) {
			logger.info("File uploading is complete. Attempting to determine if file is compressed.");

			File document = Paths.get(filePath).toFile();

			if (supportingDocument.isCompressed()) {
				return handleCompressedDocument(supportingDocument, document);
			}

			if (document.delete()) {
				return Response.Status.OK.getStatusCode();
			} else {
				return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
			}
		}

		return Response.Status.PARTIAL_CONTENT.getStatusCode();
	}

	private int handleCompressedDocument(SupportingDocument supportingDocument, File sourceFile) {
		logger.info(String.format("File %s is compressed.", supportingDocument.getFileName()));
		logger.info(String.format("Attempting to decompress file %s.", supportingDocument.getFileName()));

		FilePayload filePayload = supportingDocument.getFilePayload();
		String filePath = "/tmp/" + filePayload.getOriginalFileName();
		File targetFile = Paths.get(filePath).toFile();

		try {
			compressionUtils.decompress(sourceFile.toPath().toString(), targetFile.toPath().toString());
		} catch (IOException e) {
			logger.info(String.format("File %s failed to decompress. %s", supportingDocument.getFileName(), e));

			e.printStackTrace();

			if (sourceFile.delete()) {
				logger.info(String.format("File %s was deleted.", filePath));

				return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
			}

			return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
		}

		logger.info("Attempting to delete both compressed and uncompressed files.");

		if (sourceFile.delete() && targetFile.delete()) {
			logger.info(String.format("File %s and %s were deleted.", "/tmp/" + supportingDocument.getFileName(), filePath));

			return Response.Status.OK.getStatusCode();
		} else {
			logger.info(String.format("File %s and %s failed to be deleted.", "/tmp/" + supportingDocument.getFileName(), filePath));

			return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
		}
	}
}
