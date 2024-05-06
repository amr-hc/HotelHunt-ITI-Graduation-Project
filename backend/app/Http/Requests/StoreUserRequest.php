<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['required', 'string', 'max:25'], 
            'address' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:50'], 
            'fname' => ['required', 'string', 'max:100'], 
            'lname' => ['required', 'string', 'max:100'],
            'age' => ['required', 'integer', 'min:18'],
            'photo' => ['nullable', 'image', 'max:2048']
        ];
        
    }
}
