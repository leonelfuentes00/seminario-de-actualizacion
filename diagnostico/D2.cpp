#include <iostream>
using namespace std;

struct User {
    string name;
    string password;
};

User users[] = {
    {"Matias", "MatiasMatias"},
    {"Leonel", "LeonelLeonel"}
};

int findUser(const string& user) {
    for (int i = 0; i < sizeof(users) / sizeof(users[0]); i++) {
        if (users[i].name == user) {
            return i;
        }
    }
    return -1;
}

bool validateLogIn(const string& user, const string& password) {
    int userIndex = findUser(user);
    return (userIndex != -1 && users[userIndex].password == password);
}

void changePassword(int userIndex) {
    string newPassword;
    cout << "Ingrese su nueva contraseña: ";
    cin >> newPassword;
    users[userIndex].password = newPassword;
    cout << "Contraseña actualizada con éxito." << endl;
}

void menu(int userIndex) {
    int option;
    do {
        cout << "Menu de opciones:" << endl;
        cout << "1. Cambiar contraseña" << endl;
        cout << "2. Salir" << endl;
        cout << "Seleccione una opcion: ";
        cin >> option;

        switch (option) {
            case 1:
                changePassword(userIndex);
                break;
            case 2:
                cout << "Saliendo...\n";
                return;
            default:
                cout << "Opcion invalida. Intente nuevamente." << endl;
        }
    } while (true);
}

void authenticate() {
    int attempts = 0;
    const int maxAttempts = 3;
    string user, password;

    while (attempts < maxAttempts) {
        cout << "Nombre de usuario: ";
        cin >> user;
        cout << "Contraseña: ";
        cin >> password;

        if (validateLogIn(user, password)) {
            int userIndex = findUser(user);
            cout << "¡Bienvenido/a " << user << "!" << endl;
            menu(userIndex);
            return;
        } else {
            attempts++;
            cout << "Usuario y/o contraseña incorrecta. Intentos restantes: " << (maxAttempts - attempts) << endl;
        }
    }
    cout << "Usuario bloqueado. Contacte al administrador." << endl;
}

int main() {
    authenticate();
    return 0;
}