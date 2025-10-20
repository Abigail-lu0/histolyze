package com.histolyze.histolyze.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails { // <-- ¡LA CLAVE ESTÁ AQUÍ!

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(nullable = false)
    private String nombre;

    // Tu compañera añadió 'apellido' en el backend, asegúrate de tenerlo
    @Column(nullable = false)
    private String apellido;

    @Column(unique = true, nullable = false)
    private String dni;

    @Column(name = "contrasena", nullable = false)
    private String password;

    public enum Rol {
        ADMIN,
        USER
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol role;

    // --- MÉTODOS REQUERIDOS POR UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convertimos nuestro Rol a un formato que Spring Security entiende
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        // Usamos el DNI como el "nombre de usuario" para el login
        return this.dni;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}