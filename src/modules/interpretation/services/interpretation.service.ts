import { HttpClientProvider } from "./../../../providers/http-client/http-client";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

@Injectable()
export class InterpretationService {
  constructor(private httpClient: HttpClientProvider) {}

  create(interpretationData: any, rootUrl: any) {
    return new Observable(observer => {
      const url =
        rootUrl +
        "/interpretations/" +
        interpretationData.type +
        "/" +
        interpretationData.id;
      this.httpClient.defaultPost(url, interpretationData.message).subscribe(
        () => {
          const interpretationsUrl =
            rootUrl +
            interpretationData.type +
            "s/" +
            interpretationData.id +
            "?fields=interpretations[id,type,text,lastUpdated,href,created,likes,likedBy[id,name,displayName],user[id,name,displayName],comments[id,created,lastUpdated,text,user[id,name,displayName]]," +
            interpretationData.type +
            "[id,name]]";
          this.httpClient.get(interpretationsUrl, true).subscribe(
            (interpretationResponse: any) => {
              observer.next(interpretationResponse.interpretations);
              observer.complete();
            },
            interpretationError => observer.error(interpretationError)
          );
        },
        error => observer.error(error)
      );
    });
  }

  edit(interpretation: any, rootUrl) {
    return new Observable(observer => {
      this.httpClient
        .put(
          rootUrl + "/interpretations/" + interpretation.id,
          interpretation.text
        )
        .subscribe(
          () => {
            this.getInterpretation(interpretation, rootUrl).subscribe(
              interpretation => {
                observer.next(interpretation);
                observer.complete();
              },
              interpretationError => observer.error(interpretationError)
            );
          },
          error => observer.error(error)
        );
    });
  }

  delete(interpretation: any, rootUrl) {
    return this.httpClient.delete(
      rootUrl + "/interpretations/" + interpretation.id
    );
  }

  updateLikeStatus(interpretation: any, rootUrl: string, like: boolean = true) {
    return new Observable(observer => {
      const likePromise = like
        ? this.httpClient.defaultPost(
            rootUrl + "interpretations/" + interpretation.id + "/like",
            {}
          )
        : this.httpClient.delete(
            rootUrl + "interpretations/" + interpretation.id + "/like"
          );

      likePromise.subscribe(
        () => {
          this.getInterpretation(interpretation, rootUrl).subscribe(
            interpretation => {
              observer.next(interpretation);
              observer.complete();
            },
            interpretationError => observer.error(interpretationError)
          );
        },
        error => observer.error(error)
      );
    });
  }

  postComment(interpretation: any, rootUrl: string) {
    return new Observable(observer => {
      this.httpClient
        .defaultPost(
          rootUrl + "interpretations/" + interpretation.id + "/comments",
          interpretation.comment
        )
        .subscribe(
          () => {
            this.getInterpretation(interpretation, rootUrl).subscribe(
              interpretation => {
                observer.next(interpretation);
                observer.complete();
              },
              interpretationError => observer.error(interpretationError)
            );
          },
          commentError => observer.error(commentError)
        );
    });
  }

  deleteComment(rootUrl: string, interpretationId: string, commentId: string) {
    return this.httpClient.delete(
      rootUrl + "interpretations/" + interpretationId + "/comments/" + commentId
    );
  }

  editComment(rootUrl: string, interpretation: any, comment: any) {
    return new Observable(observer => {
      this.httpClient
        .put(
          rootUrl +
            "interpretations/" +
            interpretation.id +
            "/comments/" +
            comment.id,
          comment.text
        )
        .subscribe(
          () => {
            this.getInterpretation(interpretation, rootUrl).subscribe(
              interpretation => {
                observer.next(interpretation);
                observer.complete();
              },
              interpretationError => observer.error(interpretationError)
            );
          },
          commentError => observer.error(commentError)
        );
    });
  }

  getInterpretation(interpretation: any, rootUrl: string) {
    const interpretationUrl =
      rootUrl +
      "interpretations/" +
      interpretation.id +
      ".json?fields=id,type,text,lastUpdated,href," +
      "created,likes,likedBy[id,name,displayName],user[id,name,displayName],comments[id,created,lastUpdated,text,user[id,name,displayName]]," +
      interpretation.type.toLowerCase() +
      "[id,name]";
    return this.httpClient.get(interpretationUrl, true);
  }
}
