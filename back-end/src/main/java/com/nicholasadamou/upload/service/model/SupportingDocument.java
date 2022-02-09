package com.nicholasadamou.upload.service.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tomcat.util.codec.binary.Base64;

import java.util.Arrays;

public class SupportingDocument {
	private FilePayload filePayload;
	private String fileName;
	private String fileType;
	private byte[] data;

	public SupportingDocument() {
	}

	public SupportingDocument(FilePayload filePayload) {
		this.filePayload = filePayload;

		this.fileName = filePayload.getFileName();
		this.fileType = filePayload.getFileType();
	}

	public SupportingDocument(FilePayload filePayload, String fileName, String fileType, byte[] data) {
		this.filePayload = filePayload;
		this.fileName = fileName;
		this.fileType = fileType;
		this.data = data;
	}

	public FilePayload getFilePayload() {
		return filePayload;
	}

	public void setFilePayload(FilePayload filePayload) {
		this.filePayload = filePayload;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public byte[] getData() {
		return data;
	}

	public void setData(byte[] data) {
		this.data = data;
	}

	public boolean isCompressed() {
		return fileType.equals("application/gzip");
	}

	public static SupportingDocument constructFromBase64(String base64) {
		String decoded = new String(Base64.decodeBase64(base64.getBytes()));

		ObjectMapper objectMapper = new ObjectMapper();

		FilePayload filePayload = new FilePayload();

		try {
			filePayload = objectMapper.readValue(decoded, FilePayload.class);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new SupportingDocument(filePayload);
	}

	@Override
	public String toString() {
		return "SupportingDocument{" +
				"filePayload=" + filePayload +
				", fileName='" + fileName + '\'' +
				", fileType='" + fileType + '\'' +
				", data=" + Arrays.toString(data) +
				'}';
	}
}
