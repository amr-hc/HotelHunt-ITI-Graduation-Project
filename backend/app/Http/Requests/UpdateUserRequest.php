<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:25'], 
            'address' => ['nullable', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:50'], 
            'fname' => ['nullable', 'string', 'max:100'], 
            'lname' => ['nullable', 'string', 'max:100'],
            'age' => ['nullable', 'integer', 'min:18'],
            'photo' => ['nullable', 'image', 'max:2048']
        ];
        
    }
}
