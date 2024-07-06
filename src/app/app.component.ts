import { ApiResponseModel, Itask, task } from './model/task';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MasterService } from './service/master.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DatePipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  taskObj: task = new task();
  taskList: Itask[] = [];
  masterService = inject(MasterService);

  ngOnInit(): void {
    this.loadAllTask();
  }
  loadAllTask() {
    this.masterService.getAllTaskList().subscribe((res: ApiResponseModel) => {
      this.taskList = res.data;
    });
  }
  addTask() {
    this.masterService.addNewTask(this.taskObj).subscribe(
      (res: ApiResponseModel) => {
        if (res.result) {
          alert('Task Created Successfully');
          this.loadAllTask();
          this.taskObj = new task();
        }
      },
      (error) => {
        alert('API Error!');
      }
    );
  }

  updateTask() {
    this.masterService.updateTask(this.taskObj).subscribe(
      (res: ApiResponseModel) => {
        if (res.result) {
          alert('Task Updated Successfully');
          this.loadAllTask();
          this.taskObj = new task();
        }
      },
      (error) => {
        alert('API Error!');
      }
    );
  }
  editTask(item: task) {
    this.taskObj = item;
    setTimeout(() => {
      const date = new Date(this.taskObj.dueDate);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + date.getMonth() + 1).slice(-2);
      const today = date.getFullYear() + '-' + month + '-' + day;

      const inputeValue = (<HTMLInputElement>(
        document.getElementById('textDate')
      )).value;
      (<HTMLInputElement>document.getElementById('textDate')).value = today;
    }, 1000);
  }
  deleteTask(id: number) {
    const isConferm = confirm('Delete this task!');
    if (isConferm) {
      this.masterService.deleteTask(id).subscribe(
        (res: ApiResponseModel) => {
          if (res.result) {
            alert('Task Deleted Successfully');
            this.loadAllTask();
          }
        },
        (error) => {
          alert('API Error!');
        }
      );
    }
  }
}
