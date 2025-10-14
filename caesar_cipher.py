


CHAR_LIMIT = ord('Z')
FIRST_CHAR = ord('A')
ALPHABET = CHAR_LIMIT - FIRST_CHAR + 1
def caesar_cipher(message, shift):  
    terminal_msg = ""
    for char in message.upper():
        if char.isalpha():
    #order() function converts a character into its ASCII value
            character_convert = ord(char)
            caesar_code = character_convert + shift
            if caesar_code > CHAR_LIMIT:
                    caesar_code -= ALPHABET
            if caesar_code < FIRST_CHAR:
                    caesar_code += ALPHABET
    #chr() function converts an ASCII value back into a character
            convert_msg = chr(caesar_code)
            terminal_msg += convert_msg
            
                    
        else:
            terminal_msg += char
    print(terminal_msg)

input_message =input('message encoded:')
new_shift = int(input('shift number:'))
caesar_cipher(input_message, new_shift)