import re


def is_valid_email(email):
    """Make a regular expression for validating an Email"""
    regex = "^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$"
    if re.search(regex, email):
        return True
    return False


def sequencer(value, count):
    """Generates a sequence with a specifies set count length"""
    return f"{'0' * (count - len(str(value)))}{value}"


def sequence_alpha(value: str):
    alphabet = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    alphas = list(value)

    total = len(value)
    index = total - 1

    while index > -1:
        alpha = alphas[index]

        if not alpha is alphabet[-1]:
            alphas[index] = alphabet[alphabet.index(alpha) + 1]

            reset = index + 1
            while reset <= total - 1:
                alphas[reset] = "A"
                reset += 1

            break

        index -= 1

    all_Z = [letter is alphabet[-1] for letter in alphas]

    if all(all_Z):
        # oh, ok, ah! whatever just grow the sequence prefix
        alphas.append("A")

    return "".join(alphas)
