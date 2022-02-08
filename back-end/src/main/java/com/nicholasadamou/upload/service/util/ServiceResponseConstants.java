package com.nicholasadamou.upload.service.util;

import javax.ws.rs.core.Response;

public interface ServiceResponseConstants {
    String DEFAULT_SERVICE_ERROR_MSG = "An unexpected error occurred.";

    Response DEFAULT_ERROR_RESPONSE = Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(DEFAULT_SERVICE_ERROR_MSG).build();
}
