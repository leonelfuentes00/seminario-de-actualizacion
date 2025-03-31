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

bool validateLogIn(const string& user, const string& password) {
    for (const auto& u : users) {
        if (u.name == user && u.password == password) {
            return true;
        }
    }
    return false;
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
            cout << "¡Bienvenido/a " << user << "!" << endl;
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