package visualmserver.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import visualmserver.exceptions.TokenException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

@Component
public class JWTRequestFilter extends OncePerRequestFilter {
    @Autowired
    private JWTokenUtils tokenUtils;

    private static final Set<String> SECURED_PATHS = Set.of("/materials", "/ingredients", "/user", "/report", "/config");
    private static final Set<String> ALLOWED_GET_PATHS = Set.of("/materials", "/ingredients", "/config");

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String encodedToken;

        try {
            String path = request.getServletPath();

            // HTTP OPTIONS requests and paths that don't require JWT checks should be ignored
            if (HttpMethod.OPTIONS.matches(request.getMethod()) ||
                    SECURED_PATHS.stream().noneMatch(path::startsWith)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Currently all GET endpoints of secured path should not be locked behind a JWT token
            if (HttpMethod.GET.matches(request.getMethod()) &&
                    ALLOWED_GET_PATHS.stream().anyMatch(path::startsWith)) {
                filterChain.doFilter(request, response);
                return;
            }

            // get token from auth request header
            encodedToken = request.getHeader(HttpHeaders.AUTHORIZATION);

            // Make sure the token was received from the auth header
            if (encodedToken == null) {
                throw new TokenException("Authentication problem");
            }

            encodedToken = encodedToken.replace("Bearer ", "");

            JWTokenInfo tokenInfo = tokenUtils.decode(encodedToken);

            request.setAttribute(JWTokenInfo.ATTRIBUTE_KEY, tokenInfo);

            filterChain.doFilter(request, response);
        } catch (TokenException e) {
            System.out.println(e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication error");
            return;
        }
    }
}
