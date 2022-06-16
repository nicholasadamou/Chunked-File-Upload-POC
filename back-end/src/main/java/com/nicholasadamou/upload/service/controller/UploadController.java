package com.nicholasadamou.upload.service.controller;

import com.nicholasadamou.upload.service.model.FilePayload;
import com.nicholasadamou.upload.service.model.ChunkedFile;
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

@CrossOrigin
@Component
public class UploadController {
	Logger logger = LoggerFactory.getLogger(UploadController.class);

	@Autowired
	private CompressionUtils compressionUtils;

	@Autowired
	private Utilities utilities;

	private final String TMP_FILE_PATH = "/tmp/";

	public int buildFile(MultipartFile file, String contentRange, int chunkIndex) {
		String fileName = file.getOriginalFilename();
		String base64 = utilities.getFileNameWithoutExtension(fileName);
		ChunkedFile chunkedFile = ChunkedFile.constructFromBase64(base64);
		String filePath = TMP_FILE_PATH + chunkedFile.getFileName();

		boolean isFileUploaded = utilities.isFileUploadCompleted(contentRange);

		logger.info(String.format("Received %s", chunkedFile));
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

				logger.info(String.format("File %s created and chunk index %d appended.", chunkedFile.getFileName(), chunkIndex));
			} else {
				logger.info(String.format("Creating file failed due to file %s already exists.", chunkedFile.getFileName()));
				logger.info(String.format("Attempting to delete file %s.", chunkedFile.getFileName()));

				File document = new File(filePath);

				if (document.delete()) {
					logger.info(String.format("File %s deleted.", chunkedFile.getFileName()));
					logger.info(String.format("Creating file %s at %s.", chunkedFile.getFileName(), filePath));

					try {
						didCreateFile = new File(filePath).createNewFile();
					} catch (IOException e) {
						e.printStackTrace();
					}

					if (didCreateFile) {
						utilities.appendDataToFile(file, filePath);

						logger.info(String.format("File %s created and chunk index %d appended.", chunkedFile.getFileName(), chunkIndex));
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

			if (chunkedFile.isCompressed()) {
				return handleCompressedDocument(chunkedFile, document);
			} else {
				logger.info("File is not compressed.");
			}

			logger.info(String.format("Attempting to delete %s.", filePath));

			if (document.delete()) {
				logger.info(String.format("File %s was deleted.", filePath));

				return Response.Status.OK.getStatusCode();
			} else {
				logger.info(String.format("File %s failed to be deleted.", filePath));

				return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
			}
		}

		return Response.Status.PARTIAL_CONTENT.getStatusCode();
	}

	private int handleCompressedDocument(ChunkedFile chunkedFile, File sourceFile) {
		logger.info(String.format("File %s is compressed.", chunkedFile.getFileName()));
		logger.info(String.format("Attempting to decompress file %s.", chunkedFile.getFileName()));

		FilePayload filePayload = chunkedFile.getFilePayload();
		String filePath = TMP_FILE_PATH + filePayload.getOriginalFileName();
		File targetFile = Paths.get(filePath).toFile();

		try {
			compressionUtils.decompress(sourceFile.toPath().toString(), targetFile.toPath().toString());
		} catch (IOException e) {
			logger.info(String.format("File %s failed to decompress. Attempting to delete the uncompressed file. %s", chunkedFile.getFileName(), e));

			e.printStackTrace();

			if (sourceFile.delete()) {
				logger.info(String.format("File %s was deleted.", filePath));

				return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
			}

			return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
		}

		logger.info("Attempting to delete both compressed and uncompressed files.");

		if (sourceFile.delete() && targetFile.delete()) {
			logger.info(String.format("File %s and %s were deleted.", TMP_FILE_PATH + chunkedFile.getFileName(), filePath));

			return Response.Status.OK.getStatusCode();
		} else {
			logger.info(String.format("File %s and %s failed to be deleted.", TMP_FILE_PATH + chunkedFile.getFileName(), filePath));

			return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
		}
	}
}
