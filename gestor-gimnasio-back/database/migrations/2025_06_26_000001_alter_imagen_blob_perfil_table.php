<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('perfil', function (Blueprint $table) {
            if (!Schema::hasColumn('perfil', 'foto')) {
                $table->binary('foto')->nullable()->after('id_usuario');
            }
        });
    }

    public function down()
    {
        Schema::table('perfil', function (Blueprint $table) {
            if (Schema::hasColumn('perfil', 'foto')) {
                $table->dropColumn('foto');
            }
        });
    }
};
