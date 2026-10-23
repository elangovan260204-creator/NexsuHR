
package com.nexushr.authservice;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.io.Console;
import java.util.Arrays;

public class PasswordHash {
    public static void main(String[] args) {
        Console console = System.console();

        if (console == null) {
            System.out.println("Run this program in a real terminal.");
            return;
        }

        char[] password =
                console.readPassword("Enter a new test password: ");

        try {
            BCryptPasswordEncoder encoder =
                    new BCryptPasswordEncoder();

            String hash = encoder.encode(new String(password));

            System.out.println("BCrypt hash generated successfully.");
            System.out.println("Hash length: " + hash.length());
            System.out.println("Hash prefix: " + hash.substring(0, 7));

            // Temporarily print the hash for your local database update.
            System.out.println("Hash: " + hash);
        } finally {
            Arrays.fill(password, '\0');
        }
    }
}
