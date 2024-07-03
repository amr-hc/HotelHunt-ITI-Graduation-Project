<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHotelRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:3','max:100','unique:hotels,name'],
            'country' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'owner_id' => ['required', 'integer', 'max:100'],
            'status' => [ 'string'],
            'image' => ['nullable', 'image', 'max:2048']

        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'The Title is required',
            'name.integer' => 'The Title must be a integer',
            'name.min' => 'The Title must be at least 3 characters',
            'name.max' => 'The Title cannot be more than 255 characters',
            'owner_id.required'=>"Owner Name is required",
            // 'status.required'=>"Status is required",
            'country.required' => 'The Country is required',
            'city.required' => 'The City is required',
            'address.required' => 'The Address is required',
        ];
    }
}
