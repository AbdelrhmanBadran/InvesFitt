import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class CopyService {
  async copyToClipboard(value: string): Promise<void> {
    try {
      await navigator?.clipboard.writeText(value);
      Swal.fire({
        text:  "Value copied successfully",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#4d7f9f",
      });
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  }
}
