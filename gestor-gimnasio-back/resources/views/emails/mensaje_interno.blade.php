<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nuevo mensaje interno</title>
</head>
<body>
    @if(isset($esAlumno) && $esAlumno)
        <h2>Has recibido un nuevo mensaje de Fit Manager</h2>
    @else
        <h2>Has recibido un nuevo mensaje</h2>
    @endif
    <p><strong>Remitente:</strong> {{ $remitente }}</p>
    <p><strong>Mensaje:</strong></p>
    <p>{!! nl2br(e($mensaje)) !!}</p>
</body>
</html>
