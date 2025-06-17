<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Interfaces\UsuarioRepositoryInterface;
use App\Http\Repositories\UsuarioRepository;
use App\Http\Interfaces\UsuarioServiceInterface;
use App\Http\Services\UsuarioService;
use App\Http\Interfaces\AuthServiceInterface;
use App\Http\Interfaces\ContactoRepositoryInterface;
use App\Http\Interfaces\ContactoServiceInterface;
use App\Http\Interfaces\InscripcionRepositoryInterface;
use App\Http\Interfaces\InscripcionServiceInterface;
use App\Http\Interfaces\SalaRepositoryInterface;
use App\Http\Interfaces\SalaServiceInterface;
use App\Http\Interfaces\TipoActividadRepositoryInterface;
use App\Http\Interfaces\TipoActividadServiceInterface;
use App\Http\Interfaces\TurnoClaseRepositoryInterface;
use App\Http\Interfaces\TurnoClaseServiceInterface;
use App\Http\Interfaces\MaterialRepositoryInterface;
use App\Http\Interfaces\MaterialServiceInterface;
use App\Http\Repositories\ContactoRepository;
use App\Http\Repositories\InscripcionRepository;
use App\Http\Repositories\SalaRepository;
use App\Http\Repositories\TipoActividadRepository;
use App\Http\Repositories\TurnoClaseRepository;
use App\Http\Repositories\MaterialRepository;
use App\Http\Services\AuthService;
use App\Http\Services\ContactoService;
use App\Http\Services\InscripcionService;
use App\Http\Services\SalaService;
use App\Http\Services\TipoActividadService;
use App\Http\Services\TurnoClaseService;
use App\Http\Services\MaterialService;
use App\Http\Interfaces\PerfilServiceInterface;
use App\Http\Services\PerfilService;
use App\Http\Interfaces\PerfilRepositoryInterface;
use App\Http\Repositories\PerfilRepository;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            UsuarioRepositoryInterface::class,
            UsuarioRepository::class
        );

        $this->app->bind(
            UsuarioServiceInterface::class,
            UsuarioService::class
        );

        $this->app->bind(
            AuthServiceInterface::class,
            AuthService::class
        );

        $this->app->bind(
            TurnoClaseRepositoryInterface::class,
            TurnoClaseRepository::class
        );

        $this->app->bind(
            TurnoClaseServiceInterface::class,
            TurnoClaseService::class
        );

        $this->app->bind(
            InscripcionRepositoryInterface::class,
            InscripcionRepository::class
        );

        $this->app->bind(
            InscripcionServiceInterface::class,
            InscripcionService::class
        );

        $this->app->bind(
            TipoActividadRepositoryInterface::class,
            TipoActividadRepository::class
        );

        $this->app->bind(
            TipoActividadServiceInterface::class,
            TipoActividadService::class
        );

        $this->app->bind(
            SalaRepositoryInterface::class,
            SalaRepository::class
        );

        $this->app->bind(
            SalaServiceInterface::class,
            SalaService::class
        );

        $this->app->bind(
            ContactoServiceInterface::class,
            ContactoService::class
        );

        $this->app->bind(
            ContactoRepositoryInterface::class,
            ContactoRepository::class
        );

        $this->app->bind(MaterialServiceInterface::class, MaterialService::class);
        $this->app->bind(MaterialRepositoryInterface::class, MaterialRepository::class);

        $this->app->bind(
            PerfilServiceInterface::class,
            PerfilService::class
        );

        $this->app->bind(
            PerfilRepositoryInterface::class,
            PerfilRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
