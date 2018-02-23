# pwned-password-checker
Web extension for validating Leaked Passwords using V2 of API which supports k-Anonymity

Link: https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/


Steps to test it.

1. Download crx file or the code base.
2. Open chrome
3. chrome://extensions, developer mode
4. Load unpack extension or drop the CRX file.
5. You would see the logo
6. Now, when you navigate to a page, it will show a link check password under the password field.
7. After you type the password and before submitting, click on the link.
8. It will fetch based on prefix of the hash whether the password is compromised or not.
9. You should see the result in the alert box.


Note: This is alpha alpha protoype.
