package com.nicholasadamou.upload.service.util;

import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;

/**
 * Licensed Materials - Property of IBM
 * <p>
 * (C) Copyright IBM Corp. 2022. All Rights Reserved.
 * <p>
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
@Component
public class CompressionUtils
{
	public void decompress(final String sourceFile, final String targetFile) throws IOException
	{
		// Create a file input stream to read the source file.
		FileInputStream fileInputStream = new FileInputStream(sourceFile);

		// Create a gzip input stream to decompress the source
		// file defined by the file input stream.
		GZIPInputStream gzipInputStream = new GZIPInputStream(fileInputStream);

		// Create file output stream where the decompression result
		// will be stored.
		FileOutputStream fileOutputStream = new FileOutputStream(targetFile);

		// Create a buffer and temporary variable used during the
		// file decompress process.
		byte[] buffer = new byte[1024];
		int length;

		// Read from the compressed source file and write the
		// decompress file.
		while ((length = gzipInputStream.read(buffer)) > 0) {
			fileOutputStream.write(buffer, 0, length);
		}
	}
}
