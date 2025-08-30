@component('mail::message')
# Document Request Reviewed

Hello {{ $req->user->name }},

Your document request for **{{ $req->document_type }}** has been reviewed.

**Status:** {{ $req->status }}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
