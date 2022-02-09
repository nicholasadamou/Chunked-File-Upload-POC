package com.nicholasadamou.upload.service.model;

public class FilePayload {
	private String fileName;
	private String fileType;
	private String originalFileName;
	private String originalFileExtension;

	public FilePayload() {
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

	public String getOriginalFileName() {
		return originalFileName;
	}

	public void setOriginalFileName(String originalFileName) {
		this.originalFileName = originalFileName;
	}

	public String getOriginalFileExtension() {
		return originalFileExtension;
	}

	public void setOriginalFileExtension(String originalFileExtension) {
		this.originalFileExtension = originalFileExtension;
	}

	@Override
	public String toString() {
		return "FilePayload{" +
				"fileName='" + fileName + '\'' +
				", fileType='" + fileType + '\'' +
				", originalFileName='" + originalFileName + '\'' +
				", originalFileExtension='" + originalFileExtension + '\'' +
				'}';
	}
}
