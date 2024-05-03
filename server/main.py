import functions_framework

from markupsafe import escape


@functions_framework.http
def gallery_server(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    request_json = request.get_json(silent=True)
    request_args = request.args

    if request_json and "name" in request_json:
        name = request_json["name"]
    elif request_args and "name" in request_args:
        name = request_args["name"]
    else:
        name = "World"
    return f"Hello {escape(name)} from {request.host}!"

    # TODO
    # - make sure DNS is resolved properly so that this function is called
    #
    # - read HTML from file in bucket and outputs it
    #    - see if caching can be used here in cloud functions
    # - OR make vite to produce this python code who send HTML directly
    #
    #
