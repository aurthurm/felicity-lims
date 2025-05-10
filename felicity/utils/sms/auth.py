from httpx import Auth


class TokenAuth(Auth):
    def __init__(self, access_token):
        self.access_token = access_token

    def auth_flow(self, request):
        request.headers['Authorization'] =  'Bearer %s' % self.access_token
        yield request

