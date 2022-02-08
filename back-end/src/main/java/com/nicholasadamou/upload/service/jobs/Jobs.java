package com.nicholasadamou.upload.service.jobs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Date;
import java.util.Objects;

/**
 * Licensed Materials - Property of IBM
 * <p>
 * (C) Copyright IBM Corp. 2022. All Rights Reserved.
 * <p>
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
@Component
// https://spring.io/guides/gs/scheduling-tasks/
public class Jobs {
	private static final Logger log = LoggerFactory.getLogger(Jobs.class);

	private final int FILE_AGE_THRESHOLD = 5;

	@Scheduled(fixedRate = FILE_AGE_THRESHOLD * 60 * 1000)
	public void deleteFilesInTmpDirectory() {
		final String TMP_DIRECTORY = "/tmp";

		log.info("Deleting files in {} that are >= {} minutes old.", TMP_DIRECTORY, FILE_AGE_THRESHOLD);

		File tmp = new File(TMP_DIRECTORY);

		for (File file : Objects.requireNonNull(tmp.listFiles())) {
			if (!file.isDirectory()) {
				String fileName = file.getName();

				if (!fileName.contains(".")) continue;

				String[] fileNameParts = fileName.split("\\.");
				String fileExtension = fileNameParts[1];

				if (isValidFileExtension(fileExtension)) {
					long difference = new Date().getTime() - file.lastModified();

					if (difference >= (long) FILE_AGE_THRESHOLD * 60 * 1000) {
						if (file.delete()) {
							log.info("File {} was deleted.", file.getName());
						}
					}
				}
			}
		}

		log.info("Job completed.");
	}

	private boolean isValidFileExtension(String fileExtension) {
		return fileExtension.equals("gz")
				|| fileExtension.equals("zip")
				|| fileExtension.equals("xlsx")
				|| fileExtension.equals("xls")
				|| fileExtension.equals("doc")
				|| fileExtension.equals("docx")
				|| fileExtension.equals("pdf")
				|| fileExtension.equals("csv");
	}
}
